class NotificationManager {
    constructor(db, webPush, vapidDetails) {
        this.db = db;
        this.webPush = webPush;
        this.webPush.setVapidDetails(
            `mailto:${vapidDetails.email}`, 
            vapidDetails.publicKey, 
            vapidDetails.privateKey
        );
    }

    async subscribeUser(userId, subscription) {
        if (subscription && subscription.endpoint) {
            const checkQuery = 'SELECT * FROM subscriptions WHERE userId = ? AND subscription = ?';
            const result = await this.query(checkQuery, [userId, JSON.stringify(subscription)]);

            if (result.length > 0) {
                console.log('La suscripción ya existe:', { userId, subscription });
                return { message: 'Ya estás suscrito', status: 200 };
            } else {
                const insertQuery = 'INSERT INTO subscriptions (userId, subscription, created_at) VALUES (?, ?, NOW())';
                await this.query(insertQuery, [userId, JSON.stringify(subscription)]);
                console.log('Nueva suscripción guardada:', { userId, subscription });
                return { message: 'Suscripción exitosa', status: 201 };
            }
        } else {
            throw new Error('Suscripción inválida');
        }
    }

    async sendPushNotification(message) {
        const query = 'SELECT userId, subscription FROM subscriptions';
        const results = await this.query(query);

        for (const row of results) {
            const subscription = JSON.parse(row.subscription);
            const isValid = await this.verifySubscription(subscription);

            if (!isValid) {
                await this.deleteInvalidSubscription(row.userId, row.subscription);
            } else {
                const payload = JSON.stringify({
                    title: 'Nuevo Mensaje',
                    body: message,
                    url: 'http://localhost:3000/'
                });

                try {
                    await this.webPush.sendNotification(subscription, payload);
                    console.log('Notificación enviada');
                } catch (err) {
                    console.error('Error al enviar la notificación', err);
                }
            }
        }
    }

    async verifySubscription(subscription) {
        try {
            await this.webPush.sendNotification(subscription, 'Verificación');
            return true;
        } catch (err) {
            if (err.statusCode === 410) {
                return false; // La suscripción ya no es válida
            }
            throw err;
        }
    }

    async deleteInvalidSubscription(userId, subscription) {
        const deleteQuery = 'DELETE FROM subscriptions WHERE userId = ? AND subscription = ?';
        await this.query(deleteQuery, [userId, subscription]);
        console.log('Suscripción inválida eliminada:', userId);
    }

    // Método helper para consultas SQL con promesas
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}


module.exports = NotificationManager;
