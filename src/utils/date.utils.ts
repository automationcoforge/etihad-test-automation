export class DateUtils {

 static async getDate(daysFromToday: number): Promise<string> {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

static async getTimeInMinutes(departureTime: string): Promise<number> {
  const [hours, minutes] = departureTime!.split(':').map(Number);
  return hours * 60 + minutes;
}



}
