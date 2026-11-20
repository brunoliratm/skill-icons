// Keep the API root useful alongside the static homepage.
module.exports = (_req, res) => res.redirect(307, '/');
