# VRChat Proxy (readonly)
URL: ``https://vrchat.aries.fyi``

# Important considerations
* Will reject any requests that aren't GET.
* Will drop both the `cookie` and `authorization` headers.
* Responses are aggressively cached.

# Usage
All requests sent to `https://vrchat.aries.fyi` will be proxied to `https://api.vrchat.cloud/api`. For example, a request to `https://vrchat.aries.fyi/1/config` will be proxied to `https://api.vrchat.cloud/api/1/config`.