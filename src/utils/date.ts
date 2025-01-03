import moment from "moment";

export function formatDate(date: string | Date) {
    return moment(date).format("DD-MMM-YY");
}

export function getMinMaxDates(data: string[]) {
    if (!data || data.length === 0) {
        return ["", ""];
    }

    const dates = data.map((row) => moment(row));
    const minDate = moment.min(dates).format("YYYY-MM-DD"); // Format for HTML date input
    const maxDate = moment.max(dates).format("YYYY-MM-DD");

    return [minDate, maxDate];
}
