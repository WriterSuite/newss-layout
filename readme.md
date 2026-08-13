`wrangler.jsonc`
```
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"compatibility_date": "2026-08-08",
	"compatibility_flags": [
		"global_fetch_strictly_public"
	],
	"name": "news",
	"main": "@astrojs/cloudflare/entrypoints/server",
	"assets": {
		"directory": "./dist",
		"binding": "ASSETS"
	},
	"observability": {
		"enabled": true
	},
	"vars": {
		"API_URL": "https://subdomain.writersuite.app/api/v1",
		"API_KEY": "API_KEY",
		"WRITERSUITE_POST_LIMIT": "10"
	}
}
```