/**
 * Match includes for fetching match entities.
 *
 * @export
 * @constant matchIncludes
 * @type {object}
 * @property {boolean} connection - Whether to include the match's connection.
 */
export const matchIncludes: object = {
    match: true,
    connection: true,
    avatar: true,
    send: true,
};
