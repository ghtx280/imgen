export default function(l) {
    if (!l) return null;

    return decodeURIComponent(l)
        .split('|')
        .filter(Boolean)
        .map((e) => {
            let [_, type, data, params] = e.match(/(\w+):([^;]+)(?:;(.+))?/);

            params = params
                ?.split(',')
                .filter(Boolean)
                .map((e) => {
                    const [k, v] = e.split(':');
                    return [k, v.startsWith("0x") ? v : (+v || v)];
                });

            return {
                type,
                data,
                ...(params ? Object.fromEntries(params) : {}),
            };
        });
}