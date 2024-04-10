/**
 * Match includes for fetching match entities.
 *
 * @export
 * @constant matchIncludes
 * @type {object}
 * @property {boolean} connection - Whether to include the match's connection.
 */
export const matchIncludes: object = {
    host:{
        include: {
            avatar: true,
        }
    },
    guest:{
        include: {
            avatar: true,
        }
    },
    winner:{
        include: {
            avatar: true,
        }
    },
    loser:{
        include: {
            avatar: true,
        }
    },
};
