export default function AuthField({ label, error, endAdornment, className = "", ...props }) {
  return (
    <label className="block">
      <span className="block text-[15px] font-medium text-black mb-2">{label}</span>
      <div className="relative">
        <input
          {...props}
          className={`w-full h-[54px] rounded-full border bg-white px-6 text-[15px] text-black placeholder:text-[#acacac] outline-none transition focus:ring-2 focus:ring-[#49bbbd]/40 ${
            error ? "border-red-400" : "border-[#49bbbd]"
          } ${endAdornment ? "pr-12" : ""} ${className}`}
        />
        {endAdornment && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs text-red-500">{error}</span>}
    </label>
  )
}
