/**
 * Friend includes for fetching friend entities.
 *
 * @export
 * @constant friendIncludes
 * @type {object}
 * @property {boolean} connection - Whether to include the friend's connection.
 */
export const friendIncludes: object = {
    sender: {
        include: {
            avatar: true
        }
    },
    receiver: {
        include: {
            avatar: true
        }
    }
};

// sender: {
//     id: true,
//     username: true,
//     status: true,
//     avatar: true,
//     connection: true,
//     achievements: true,
// },
// receiver: {
//     id: true,
//     username: true,
//     status: true,
//     avatar: true,
//     connection: true,
//     achievements: true,
// },