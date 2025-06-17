#!/bin/sh
host="$1"
port="$2"
shift 2

echo "⏳ Aștept $host:$port..."
until nc -z "$host" "$port"; do
  sleep 1
done

echo "✅ $host:$port este gata. Pornesc aplicația..."
exec "$@"
