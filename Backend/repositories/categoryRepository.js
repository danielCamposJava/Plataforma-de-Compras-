
import db from "../config/database.js";


export const create = (title, image) => {
    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO category (
                title,
                image
            )
            VALUES (?, ?)
        `;

        db.run(
            sql,
            [title, image],
            function (err) {

                if (err) {
                    return reject(err);
                }

                resolve({
                    id: this.lastID
                });
            }
        );
    });
};


export const findAll = () => {
    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM category
            ORDER BY id DESC
        `;

        db.all(
            sql,
            [],
            (err, rows) => {

                if (err) {
                    return reject(err);
                }

                resolve(rows);
            }
        );
    });
};


export const findById = (id) => {
    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM category
            WHERE id = ?
        `;

        db.get(
            sql,
            [id],
            (err, row) => {

                if (err) {
                    return reject(err);
                }

                resolve(row);
            }
        );
    });
};


export const updateName = (id, title) => {
    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE category
            SET title = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [title, id],
            function (err) {

                if (err) {
                    return reject(err);
                }

                resolve({
                    changes: this.changes
                });
            }
        );
    });
};


export const remove = (id) => {
    return new Promise((resolve, reject) => {

        const sql = `
            DELETE FROM category
            WHERE id = ?
        `;

        db.run(
            sql,
            [id],
            function (err) {

                if (err) {
                    return reject(err);
                }

                resolve({
                    changes: this.changes
                });
            }
        );
    });
};
