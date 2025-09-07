export function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

export function returnTime(time) {
    let hour = parseInt(time)
    let minute = Math.ceil((time - hour) * 100) 
    if(time > 12) return `${hour - 12 == 0 ? hour : hour - 12} : ${minute == 0 ? "00" : minute} PM`
    return `${hour} : ${minute == 0 ? "00" : minute} AM`
}

export function formatMonthDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const formattedDate = `${month}/${day}`;
    return formattedDate
}


export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  }
    