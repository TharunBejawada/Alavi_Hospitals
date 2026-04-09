"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from "react-toastify";
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from 'date-fns';
import { FaCalendarDays, FaArrowLeft } from "react-icons/fa6";
import { API_URL } from "../../config";

export default function AvailabilityDashboard() {
  const router = useRouter();
  
  // Data States
  const [doctorData, setDoctorData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, any>>({});
  
  // Selection States
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Filter States
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  
  // Form States
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [available, setAvailable] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState('');

  // 1. Fetch all doctors on load
  useEffect(() => {
    axios.get(`${API_URL}/api/doctors/getAllDoctors`)
      .then(res => {
        const data = res.data.Items || [];
        setDoctorData(data);
        const depts = Array.from(new Set(data.map((doc: any) => doc.department).filter(Boolean))) as string[];
        setDepartments(depts);
      })
      .catch(err => toast.error("Failed to load doctors"));
  }, []);

  // 2. Fetch availability when doctor & location are selected
  useEffect(() => {
    if (selectedDoctor && selectedLocation) {
      axios.get(`${API_URL}/api/availability/getDoctorAvailability/${selectedDoctor}`)
        .then(res => {
          const map: Record<string, any> = {};
          res.data
            .filter((item: any) => item.location === selectedLocation)
            .forEach((item: any) => {
              map[item.date] = item;
            });
          setAvailabilityMap(map);
        })
        .catch(err => console.error(err));
    } else {
      setAvailabilityMap({});
    }
  }, [selectedDoctor, selectedLocation]);

  // Handlers
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setFilteredDoctors(doctorData.filter(doc => doc.department === dept));
    setSelectedDoctor('');
    setSelectedLocation('');
    setLocations([]);
    setShowTimeFields(false);
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docId = e.target.value;
    const doc = filteredDoctors.find(d => d.doctorId === docId);
    setSelectedDoctor(docId);
    setShowTimeFields(false);
    
    if (doc?.location) {
      // Assuming location string like "Chintal Branch, Adarsh Nagar"
      let locs = doc.location.split(',').map((l: string) => l.trim());
      setLocations(locs);
      setSelectedLocation(locs[0] || '');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
    setShowTimeFields(false);
  };

  const handleDateClick = (day: Date) => {
    if (!selectedDoctor || !selectedLocation) {
      toast.warning("Please select a Doctor and Location first.");
      return;
    }
    if (day.getDay() === 0) {
      toast.error("Sundays are not available for scheduling.");
      return;
    }

    setSelectedDate(day);
    const formatted = format(day, 'yyyy-MM-dd');
    const existing = availabilityMap[formatted];
    
    if (existing) {
      setAvailable(existing.available);
      setStartTime(existing.startTime || '');
      setEndTime(existing.endTime || '');
      setInterval(existing.interval || '');
    } else {
      setAvailable(true);
      setStartTime('');
      setEndTime('');
      setInterval('');
    }
    setShowTimeFields(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedLocation || !selectedDate) return;

    const payload = {
      doctorID: selectedDoctor,
      location: selectedLocation,
      date: format(selectedDate, 'yyyy-MM-dd'),
      available,
      ...(available && { startTime, endTime, interval })
    };

    try {
      await axios.post(`${API_URL}/api/availability/setDoctorAvailability`, payload);
      toast.success("Availability saved successfully.");
      setAvailabilityMap(prev => ({ ...prev, [payload.date]: payload }));
      setShowTimeFields(false); // Close form on success
    } catch (err) {
      toast.error('Failed to submit availability');
    }
  };

  // Generate padded calendar array (starts from Sunday, ends on Saturday)
  const generateCalendar = () => {
    const monthStart = startOfMonth(new Date(filterYear, filterMonth));
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const calendarDays = generateCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectClass = "w-full bg-[#F8F6FA] border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-gray-700";

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#5B328C] mb-2 flex items-center gap-3">
              <FaCalendarDays /> Doctor Availability
            </h1>
            <p className="text-gray-500">Manage scheduling and working hours for doctors.</p>
          </div>
          <button onClick={() => router.push("/admin/dashboard")} className="flex items-center gap-2 text-gray-600 hover:text-[#5B328C] font-semibold transition-colors">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Selectors & Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 lg:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Target Selection</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Department</label>
                <select onChange={handleDeptChange} value={selectedDept} className={selectClass}>
                  <option value="">Select Department</option>
                  {departments.map((dept, idx) => <option key={idx} value={dept}>{dept}</option>)}
                </select>
              </div>

              {selectedDept && (
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Doctor</label>
                  <select onChange={handleDoctorChange} value={selectedDoctor} className={selectClass}>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(doc => <option key={doc.doctorId} value={doc.doctorId}>{doc.name}</option>)}
                  </select>
                </div>
              )}

              {locations.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Location</label>
                  <select value={selectedLocation} onChange={handleLocationChange} className={selectClass}>
                    {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Time Configuration Form */}
            {showTimeFields && selectedDate && (
              <div className="bg-white p-6 lg:p-8 rounded-[24px] shadow-lg border-2 border-[#5B328C]/10 animate-fade-in">
                <h2 className="text-lg font-bold text-[#5B328C] mb-4">
                  Schedule: {format(selectedDate, 'MMM do, yyyy')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 bg-[#F8F6FA] p-4 rounded-xl border border-gray-100">
                    <input type="checkbox" id="avail" checked={available} onChange={() => setAvailable(!available)} className="w-5 h-5 accent-[#5B328C] cursor-pointer" />
                    <label htmlFor="avail" className="font-bold text-gray-700 cursor-pointer select-none">Mark as Available</label>
                  </div>

                  {!available ? (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl">
                      Doctor will be marked as <strong>Not Available</strong> on this date.
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block text-sm font-bold text-gray-600 mb-2">Start Time</label>
                          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className={selectClass} />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-sm font-bold text-gray-600 mb-2">End Time</label>
                          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className={selectClass} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Slot Interval</label>
                        <select value={interval} onChange={e => setInterval(e.target.value)} required className={selectClass}>
                          <option value="">Select Minutes</option>
                          {[10, 15, 20, 25, 30].map(val => <option key={val} value={val}>{val} mins</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  <button type="submit" className="w-full bg-[#5B328C] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#4a2873] transition-colors mt-2">
                    Save Availability
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Calendar */}
          <div className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-[24px] shadow-sm border border-gray-100">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
              <div className="flex gap-3">
                <select value={filterMonth} onChange={e => setFilterMonth(parseInt(e.target.value))} className="bg-[#F8F6FA] border-none rounded-lg px-4 py-2 font-semibold text-[#5B328C] outline-none">
                  {[...Array(12)].map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                </select>
                <select value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))} className="bg-[#F8F6FA] border-none rounded-lg px-4 py-2 font-semibold text-[#5B328C] outline-none">
                  {[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {weekDays.map(day => (
                <div key={day} className="text-center font-bold text-sm text-gray-400 py-2 uppercase tracking-wider">
                  {day}
                </div>
              ))}
              
              {/* Day Cells */}
              {calendarDays.map((day, idx) => {
                const formatted = format(day, 'yyyy-MM-dd');
                const isSunday = day.getDay() === 0;
                const inCurrentMonth = isSameMonth(day, new Date(filterYear, filterMonth));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day); // <-- NEW: Check if this is today
                const availability = availabilityMap[formatted];
                
                let cellStyle = "bg-white border border-gray-100 text-gray-700 hover:border-[#5B328C]/40";
                let statusDot = null;

                if (!inCurrentMonth) cellStyle = "bg-gray-50 text-gray-300 pointer-events-none";
                else if (isSunday) cellStyle = "bg-gray-50 text-gray-400 cursor-not-allowed border-dashed";
                else if (availability) {
                  if (availability.available) {
                    cellStyle = "bg-green-50 border-green-200 text-green-800 font-medium";
                    statusDot = <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto mt-1" />;
                  } else {
                    cellStyle = "bg-red-50 border-red-200 text-red-800 font-medium";
                    statusDot = <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto mt-1" />;
                  }
                }

                // Give the whole box a thick border if selected
                if (isSelected) cellStyle += " ring-2 ring-[#5B328C] ring-offset-2";
                // Give today's box a subtle purple tint if it isn't already selected or styled
                if (isCurrentDay && !isSelected && !availability) cellStyle += " bg-purple-50/30";

                return (
                  <div
                    key={idx}
                    onClick={() => inCurrentMonth && !isSunday && handleDateClick(day)}
                    className={`h-20 lg:h-24 p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative ${cellStyle}`}
                  >
                    {/* NEW: Highlight Today's Date with a solid purple circle */}
                    <span className={`text-lg flex items-center justify-center ${
                      isCurrentDay 
                        ? "bg-[#5B328C] text-white font-bold w-8 h-8 rounded-full shadow-md" 
                        : ""
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* NEW: Tiny "Today" label */}
                    {isCurrentDay && !availability && (
                      <span className="text-[9px] font-bold text-[#5B328C] uppercase tracking-wider mt-1">Today</span>
                    )}

                    {statusDot}
                    
                    {availability?.available && (
                      <span className="text-[10px] text-green-600 mt-1 hidden lg:block">
                        {availability.startTime}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-8 justify-center border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-3 h-3 rounded-full bg-green-500" /> Available</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-3 h-3 rounded-full bg-red-500" /> Unavailable</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-3 h-3 rounded-full bg-gray-200" /> No Data / Sunday</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}