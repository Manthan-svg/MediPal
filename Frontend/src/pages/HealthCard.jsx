const HealthCard = ({ icon, label, value, unit, color }) => {
    return (
      <div className={`bg-white shadow-md p-5 rounded-2xl flex items-center gap-4 w-full`}>
        <div className={`text-3xl ${color}`}>{icon}</div>
        <div>
          <div className="text-lg font-semibold">{label}</div>
          <div className="text-xl font-bold">{value} <span className="text-sm font-normal">{unit}</span></div>
        </div>
      </div>
    );
  };
  
  export default HealthCard;
  