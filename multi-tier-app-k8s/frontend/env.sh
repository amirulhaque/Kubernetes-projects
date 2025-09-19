#!/bin/sh

# Generate env-config.js dynamically
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

# Add variables (all prefixed REACT_APP_)
for var in $(env | grep REACT_APP_); do
  key=$(echo $var | cut -d= -f1)
  value=$(echo $var | cut -d= -f2-)
  echo " \"$key\": \"$value\"," >> /usr/share/nginx/html/env-config.js
done

# Close object
echo "}" >> /usr/share/nginx/html/env-config.js

exec "$@"
