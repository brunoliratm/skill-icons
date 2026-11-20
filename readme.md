# Skill Icons

Combine technology icons into a single SVG for a portfolio, documentation page, or GitHub profile. The image URL defines which icons appear, their order, their theme, and how many fit on each row.

![TypeScript, React, Node.js, PostgreSQL, Docker, and Git](https://skill-icons-v2.vercel.app/api/icons?i=ts,react,node,postgres,docker,git&theme=dark&perline=6)

[Open the icon builder](https://skill-icons-v2.vercel.app/) · [Browse the icon library](https://skill-icons-v2.vercel.app/#catalog)

## Embed an icon set

Search the library by name or shortcut, select your icons, and choose **Copy Markdown**. You can also use the image URL directly as the source of an HTML image.

**Markdown**

```markdown
![TypeScript, React, and Node.js](https://skill-icons-v2.vercel.app/api/icons?i=ts,react,node)
```

**HTML**

```html
<img
  src="https://skill-icons-v2.vercel.app/api/icons?i=ts,react,node"
  alt="TypeScript, React, and Node.js"
/>
```

## Customize the URL

`GET /api/icons` returns an image with the content type `image/svg+xml`.

| Parameter | Accepted values | Default |
| --- | --- | --- |
| `i` (also `icons`) | Comma-separated icon names or shortcuts, in display order | Required |
| `theme` (also `t`) | `light` or `dark` for icons with themed variants | `light` |
| `perline` | An integer from `1` to `50` | All icons on one row |

For example, the following URL places three icons on each row and uses the dark theme.

```text
https://skill-icons-v2.vercel.app/api/icons?i=ts,react,node,postgres,docker,git&theme=dark&perline=3
```

You can mix full names with shortcuts such as `js` for `javascript`, `py` for `python`, and `k8s` for `kubernetes`. Names are case-insensitive. See the [full shortcut list](./lib/aliases.json).

The API skips unrecognized names and returns `404` if none match. An invalid `perline` value returns `400`.

Missing an icon? [Suggest it for the library](https://github.com/brunoliratm/skill-icons/issues/new?template=suggest-icon.yml).

## License

[MIT License](./LICENSE)
