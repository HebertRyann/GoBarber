"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuidv4_1 = require("uuidv4");
var date_fns_1 = require("date-fns");
var appointmentsRouter = express_1.Router();
var appointments = [];
appointmentsRouter.post('/', function (request, response) {
    var _a = request.body, provider = _a.provider, date = _a.date;
    var parsedData = date_fns_1.startOfHour(date_fns_1.parseISO(date));
    var findAppointmentsInSameDate = appointments.find(function (appointment) {
        return date_fns_1.isEqual(parsedData, appointments.date);
    });
    if (findAppointmentsInSameDate) {
        return response.status(400)
            .json({ messagem: 'this appointments is already booked' });
    }
    ;
    var appointment = {
        id: uuidv4_1.uuid(),
        provider: provider,
        date: parsedData
    };
    appointments.push(appointment);
    return response.json(appointment);
});
exports.default = appointmentsRouter;
