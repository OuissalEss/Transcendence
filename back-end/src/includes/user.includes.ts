/**
 * User includes for fetching user entities.
 *
 * @export
 * @constant userIncludes
 * @type {object}
 * @property {boolean} connection - Whether to include the user's connection.
 */
export const userIncludes: object = {
    user: true,
    connection: true,
    avatar: true
};
