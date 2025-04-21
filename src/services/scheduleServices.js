export const getScheduleItems = () => {
    return new Promise((resolve) => {
      const items = JSON.parse(localStorage.getItem('scheduleItems') || '[]');
      setTimeout(() => resolve(items), 300); 
    });
  };
  
  export const addScheduleItem = (item) => {
    return new Promise((resolve) => {
      const items = JSON.parse(localStorage.getItem('scheduleItems') || '[]');
      const newItem = {
        ...item,
        id: Date.now() 
      };
      items.push(newItem);
      localStorage.setItem('scheduleItems', JSON.stringify(items));
      setTimeout(() => resolve(newItem), 300);
    });
  };
  
  export const deleteSchedule = (id) => {
    return new Promise((resolve) => {
      const items = JSON.parse(localStorage.getItem('scheduleItems') || '[]');
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('scheduleItems', JSON.stringify(updatedItems));
      setTimeout(() => resolve({ success: true }), 300);
    });
  };