const readme = "https://github.com/ariesclark/vrchat-proxy";
const notice = `This is a readonly proxy for the VRChat API. It is not affiliated with VRChat or VRChat Inc. Software written & distributed by ariesclark.com. For more information, visit ${readme}.`;

export default {
	async fetch(original): Promise<Response> {
		const url = new URL(original.url);
		if (url.pathname === "/")
			return Response.json({
				_comment: notice,
				readme,
				example: `${url.origin}/1/config`
			});

		url.host = "api.vrchat.cloud";
		url.port = "443";
		url.protocol = "https";
		url.pathname = `/api${url.pathname}`;

		const controller = new AbortController();
		setTimeout(() => controller.abort(), 5000);

		const request = new Request(url, original);

		if (request.method.toLowerCase() !== "get")
			return Response.json(
				{
					_comment: notice,
					error: {
						_comment: "Only GET requests are allowed.",
						message: "Method Not Allowed",
						status_code: 405
					}
				},
				{ status: 405 }
			);

		if (request.headers.has("authorization") || request.headers.has("cookie"))
			return Response.json(
				{
					_comment: notice,
					error: {
						_comment: "Requests with credentials are not allowed.",
						message: "Bad Request",
						status_code: 400
					}
				},
				{ status: 400 }
			);

		request.headers.delete("referer");
		const response = await fetch(request, { signal: controller.signal });
		let body: any = await response.text();

		if (response.headers.get("content-type")?.startsWith("application/json")) {
			const json = { _comment: notice, ...JSON.parse(body) };
			body = JSON.stringify(json, null, 2);
		}

		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}
} satisfies ExportedHandler<Env>;
