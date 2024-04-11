const { CronJob } = require('cron');
const { Op } = require('sequelize');

const Archived_Chat = require('../models/archivedChat');
const chat=require('../model/chatModel')

const cronJob = CronJob.from({
    cronTime: '0 0 * * *',
    onTick: async function () {
        const oldChats = await chat.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date()
                }
            }
        })
        oldChats.forEach(async message => {
            const data = message.toJSON();
            await Archived_Chat.create(data);
            message.destroy();
        })
    },
    start: true,
    timeZone: 'Asia/Kolkata'
})

module.exports = cronJob;

