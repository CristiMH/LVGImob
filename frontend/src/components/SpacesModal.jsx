import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Zoom } from 'yet-another-react-lightbox/plugins';
import api from '../api';
import { IoMdClose } from 'react-icons/io';
import { FaTrash } from 'react-icons/fa';
import { MdDriveFolderUpload } from "react-icons/md";
import '../styles/gradientButton.css'
import Reordering from '../components/Reordering';
import 'quill/dist/quill.snow.css';
import Editor from '../editors/Editor'
const SpacesModal = ({ visible, onClose, onSaved, saleTypes, locations, sectors, listingToEdit, user, conditions}) => {
  const quillRef = useRef();
  const isEdit = Boolean(listingToEdit);
  const [form, setForm] = useState({
    street: '',
    description: '',
    price: 0,
    availability: '',
    location_id: '',
    sector_id: '',
    sale_type_id: '',
    property_type_id: '',
    surface: '',
    offices: '',
    floor: '',
    bathrooms: '',
    condition_id: ''
  });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setForm({
        street: listingToEdit?.listing?.street || '',
        description: listingToEdit?.listing?.description || '',
        price: listingToEdit?.listing?.price || '',
        availability: listingToEdit?.listing?.availability === true
          ? 'true'
          : listingToEdit?.listing?.availability === false
            ? 'false'
            : '',
        location_id: listingToEdit?.listing?.location?.id || '',
        sector_id: listingToEdit?.listing?.sector?.id || '',
        sale_type_id: listingToEdit?.listing?.sale_type?.id || '',
        property_type_id: listingToEdit?.listing?.property_type?.id || '',
        surface: listingToEdit?.surface || '',
        offices: listingToEdit?.offices || '',
        floor: listingToEdit?.floor || '',
        bathrooms: listingToEdit?.bathrooms || '',
        condition_id: listingToEdit?.condition?.id || ''
      });
      setImages(listingToEdit?.listing?.images || []);
    }
  }, [listingToEdit, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'price' || name === 'surface' || name === 'offices' || name === 'bathrooms' || name === 'floor') {
      newValue = value.replace(/[^\d]/g, '');
    }

    if (name === 'availability') {
      newValue = value;
    }

    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));

    setErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[name];

      if (newErrors.listing_data && typeof newErrors.listing_data === 'object') {
        const { [name]: removed, ...restListing } = newErrors.listing_data;
        newErrors.listing_data = restListing;

        if (Object.keys(newErrors.listing_data).length === 0) {
          delete newErrors.listing_data;
        }
      }

      return newErrors;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);

    setErrors(prev => {
      const newErrors = { ...prev };

      if (newErrors.listing_data && typeof newErrors.listing_data === 'object') {
        delete newErrors.listing_data.images_input;

        if (Object.keys(newErrors.listing_data).length === 0) {
          delete newErrors.listing_data;
        }
      }

      return newErrors;
    });
  };


  const handleImageDelete = (imgToDelete) => {
    setImages(prev => prev.filter(img => {
      const currentUrl = typeof img === 'string' ? img : img.url;
      const targetUrl = typeof imgToDelete === 'string' ? imgToDelete : imgToDelete.url;

      const isExistingImage = currentUrl && targetUrl;
      const isNewImage = img.preview && imgToDelete.preview;

      return isExistingImage ? currentUrl !== targetUrl : img.preview !== imgToDelete.preview;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      const listingData = {
        street: form.street,
        description: form.description,
        price: form.price,
        availability: form.availability === 'true' ? true : form.availability === 'false' ? false : null,
        location_id: form.location_id || null,
        sector_id: form.sector_id || null,
        sale_type_id: form.sale_type_id || null,
        property_type_id: 3,
        user_id: user.id,
      };

      Object.entries(listingData).forEach(([key, value]) => {
        if ((value !== null && value !== undefined) || key === 'availability') {
          payload.append(`listing_data.${key}`, String(value));
        }
      });
      payload.append("surface", form.surface);
      payload.append("offices", form.offices);
      payload.append("floor", form.floor);
      payload.append("bathrooms", form.bathrooms);
      payload.append("condition_id", form.condition_id);

      images.forEach((img) => {
        if (img.file) {
          payload.append("listing_data.images_input", img.file);
        } else if (typeof img === 'string' || img.url) {
          payload.append("listing_data.images_input", img.url || img);
        }
      });

      for (let pair of payload.entries()) {
          console.log(pair[0], pair[1]);
        }

      let res;
      if (isEdit) {
        res = await api.patch(`/api/v1/commercial-spaces/${listingToEdit.id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post(`/api/v1/commercial-spaces/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (images.length === 0) {
        setErrors(prev => ({
          ...prev,
          listing_data: {
            ...prev.listing_data,
            images_input: 'Trebuie să adăugați cel puțin o imagine.'
          }
        }));
        setLoading(false);
        return;
      }

      if (res.status === 201 || res.status === 200) {
        toast.success(isEdit ? 'Anunțul a fost actualizat cu succes' : 'Anunțul a fost creat cu succes');
        onSaved();
        onClose();
      } else {
        throw new Error('Eroare la salvarea anunțului și terenului');
      }
    } catch (error) {
      if (error?.response?.data?.detail) {
        setErrors((prev) => ({ ...prev, form: error.response.data.detail }));
      } else {
        setErrors(error?.response?.data || []);
      }

      if (error.code === 'ERR_NETWORK') {
        toast.error('Eroare la salvarea anunțului.')
        setLoading(false);
        return;
      }

      console.log(error)

      if (images.length === 0) {
        setErrors(prev => ({
          ...prev,
          listing_data: {
            ...prev.listing_data,
            images_input: 'Trebuie să adăugați cel puțin o imagine.'
          }
        }));
        setLoading(false);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (img) => {
    if (typeof img === 'string') return img;
    if (img.preview) return img.preview;
    return '';
  };

  if (!visible) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}
        className="fixed top-0 left-0 z-[998] h-screen w-full bg-black/60"
      />
      <div className="fixed top-1/2 left-1/2 z-[999] w-full max-w-[400px] overflow-y-auto max-h-[100vh] transform -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="bg-white rounded-[5px] p-[30px] w-full flex flex-col gap-[10px] h-full">
          <IoMdClose
            onClick={onClose}
            className="text-3xl bg-gray-300 rounded-full p-[5px] ml-auto hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer"
          />
          <h2 className="text-[22px] font-[500]">{isEdit ? 'Modifică anunțul' : 'Adaugă un anunț'}</h2>

          <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in text-center ${errors?.form ? 'opacity-100' : 'opacity-0'}`}>{errors.form}</p>

          {
            loading ? (
              <div className="py-[60px] flex justify-center items-center">
                <Reordering />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Strada</label>
                    <input
                      type="text"
                      name="street"
                      placeholder='Strada'
                      value={form.street}
                      onChange={handleChange}
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.street ? 'opacity-100' : 'opacity-0'}`}>{errors?.listing_data?.street || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Descriere</label>
                    <Editor
                      ref={quillRef}
                      readOnly={false}
                      visible={visible}
                      defaultValue={form.description}
                      onTextChange={(contents, html) => {
                        setForm((prev) => ({ ...prev, description: html }));

                        setErrors((prevErrors) => {
                          const newErrors = { ...prevErrors };

                          if (newErrors.listing_data && typeof newErrors.listing_data === 'object') {
                            delete newErrors.listing_data.description;

                            if (Object.keys(newErrors.listing_data).length === 0) {
                              delete newErrors.listing_data;
                            }
                          }

                          return newErrors;
                        });
                      }}
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.description ? 'opacity-100' : 'opacity-0'}`}>{errors?.listing_data?.description || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Preț</label>
                    <div className="font-body flex gap-[5px] px-[24px] py-[13px] rounded-[5px] border-[1px] border-gray-300 text-[17px]">
                      <p>€</p>
                      <input
                        type="text"
                        name="price"
                        inputMode="numeric"
                        pattern="\d*"
                        value={form.price}
                        onChange={handleChange}
                        className='outline-none w-full'
                      />
                    </div>
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.price ? 'opacity-100' : 'opacity-0'}`}>{errors?.listing_data?.price || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Disponibilitate</label>
                    <select
                      name="availability"
                      value={form.availability === 'true' ? 'true' : form.availability === 'false' ? 'false' : ''}
                      onChange={handleChange}
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    >
                      <option value="" disabled>Disponibilitate</option>
                      <option value="true">Disponibil</option>
                      <option value="false">Indisponibil</option>
                    </select>
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.availability ? 'opacity-100' : 'opacity-0'}`}>{'Acest câmp nu poate fi gol.' || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px] w-full">
                    <p className="text-[14px] font-poppins font-[500]">Locație</p>
                    <select
                      name="locationSector"
                      className="font-body px-[24px] py-[13px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                      value={
                        form.location_id && form.location_id !== 1
                          ? `location-${form.location_id}`
                          : form.sector_id
                            ? `sector-${form.sector_id}`
                            : ''
                      }
                      onChange={(e) => {
                        const selectedValue = e.target.value;

                        if (selectedValue.startsWith('sector-')) {
                          const id = parseInt(selectedValue.replace('sector-', ''));
                          setForm((prev) => ({
                            ...prev,
                            location_id: 1,
                            sector_id: id,
                          }));
                        } else if (selectedValue.startsWith('location-')) {
                          const id = parseInt(selectedValue.replace('location-', ''));
                          setForm((prev) => ({
                            ...prev,
                            location_id: id,
                            sector_id: '',
                          }));
                        }

                        setErrors(prev => {
                          const newErrors = { ...prev };

                          delete newErrors.location_id;
                          delete newErrors.sector_id;

                          if (newErrors.listing_data && typeof newErrors.listing_data === 'object') {
                            delete newErrors.listing_data.location_id;
                            delete newErrors.listing_data.sector_id;

                            if (Object.keys(newErrors.listing_data).length === 0) {
                              delete newErrors.listing_data;
                            }
                          }

                          return newErrors;
                        });
                      }}
                    >
                      <option value="" disabled>
                        Locație
                      </option>

                      <optgroup label="Chișinău">
                        {sectors.map((sector) => (
                          <option key={`sector-${sector.id}`} value={`sector-${sector.id}`}>
                            {sector.sector}
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Altele">
                        {locations
                          .filter((loc) => loc.id !== 1)
                          .map((loc) => (
                            <option key={`location-${loc.id}`} value={`location-${loc.id}`}>
                              {loc.location}
                            </option>
                          ))}
                      </optgroup>
                    </select>

                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.location_id || errors?.listing_data?.sector_id ? 'opacity-100' : 'opacity-0'
                      }`}>
                      {errors?.listing_data?.location_id || errors?.listing_data?.sector_id || '.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Tipul anunțului</label>
                    <select
                      name="sale_type_id"
                      value={form.sale_type_id}
                      onChange={handleChange}
                      placeholder='Tipul anunțului'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    >
                      <option value="" disabled>Tipul anunțului</option>
                      {saleTypes && saleTypes.map((sale) => (
                        <option key={sale.id} value={sale.id}>
                          {sale.type}
                        </option>
                      ))}
                    </select>
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.listing_data?.sale_type_id ? 'opacity-100' : 'opacity-0'}`}>{errors?.listing_data?.sale_type_id || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Suprafața - m²</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      name="surface"
                      value={form.surface}
                      onChange={handleChange}
                      placeholder='Suprafața'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.surface ? 'opacity-100' : 'opacity-0'}`}>{errors.surface || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Nr. de birouri</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      name="offices"
                      value={form.offices}
                      onChange={handleChange}
                      placeholder='Nr. de birouri'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.offices ? 'opacity-100' : 'opacity-0'}`}>{errors.offices || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Nr. de băi</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      placeholder='Nr. de băi'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.bathrooms ? 'opacity-100' : 'opacity-0'}`}>{errors.bathrooms || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Etaj</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      name="floor"
                      value={form.floor}
                      onChange={handleChange}
                      placeholder='Etaj'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    />
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.floor ? 'opacity-100' : 'opacity-0'}`}>{errors.floor || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[14px] font-poppins font-[500]">Condiție</label>
                    <select
                      name="condition_id"
                      value={form.condition_id}
                      onChange={handleChange}
                      placeholder='Coniție'
                      className="font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                    >
                      <option value="" disabled>Condiție</option>
                      {conditions && conditions.map((con) => (
                        <option key={con.id} value={con.id}>
                          {con.condition}
                        </option>
                      ))}
                    </select>
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.condition_id ? 'opacity-100' : 'opacity-0'}`}>{errors?.condition_id || '.'}</p>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <input
                      type="file"
                      multiple
                      id="imageUpload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="imageUpload" className="text-[14px] font-poppins font-[500] flex gap-[5px] items-center w-[140px] mx-auto cursor-pointer">
                      <MdDriveFolderUpload className='text-xl' />
                      Adaugă Imagini
                    </label>
                  </div>

                  <div className="flex gap-[15px] flex-wrap mt-[15px]">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-[60px] h-[60px]">
                        <img
                          src={img.preview || img}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-[5px] cursor-pointer"
                          onClick={() => {
                            setIndex(idx);
                            setOpen(true);
                          }}
                        />
                        <FaTrash
                          onClick={() => handleImageDelete(img)}
                          className="absolute top-[-10px] right-[-10px] text-red-500 cursor-pointer hover:scale-[1.05] transition-all duration-75 ease-in"
                        />
                      </div>
                    ))}
                  </div>
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in text-center ${errors?.listing_data?.images_input ? 'opacity-100' : 'opacity-0'}`}>{'Incarcați imagini.' || '.'}</p>
                </div>

                <div className="flex justify-end gap-[15px]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-600 cursor-pointer hover:text-gray-900 transition-all duration-75 ease-in"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-main px-[20px] py-[9px] rounded-[5px] text-white font-[500] cursor-pointer transition-all duration-150 ease-in"
                  >
                    {isEdit ? 'Salvează' : 'Adaugă'}
                  </button>
                </div>

                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in text-center ${errors?.form ? 'opacity-100' : 'opacity-0'}`}>{errors.form}</p>
              </>
            )
          }
        </form>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: getImageSrc(img) }))}
        plugins={[Zoom]}
      />

    </>
  );
};

export default SpacesModal;