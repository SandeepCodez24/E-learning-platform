import { NavLink } from "react-router-dom"

export function AuthTabs({ active }) {
  const tabClass = (isActive) =>
    `flex h-full flex-1 items-center justify-center rounded-full text-[15px] font-medium transition-colors duration-200 ${
      isActive ? "bg-[#49bbbd] text-white shadow-sm" : "text-white"
    }`

  return (
    <div className="mx-auto flex h-[59px] w-full max-w-[329px] items-center rounded-full bg-[#49bbbd]/60 p-1.5">
      <NavLink to="/login" className={() => tabClass(active === "login")}>
        Login
      </NavLink>
      <NavLink to="/register" className={() => tabClass(active === "register")}>
        Register
      </NavLink>
    </div>
  )
}

export default function AuthShell({ photo, heading, subheading, active, tagline, description, children }) {
  return (
    <div className="min-h-screen w-full bg-[#fffefc] flex items-center justify-center p-4 py-8 lg:p-10">
      <div className="flex w-full max-w-[1400px] items-stretch gap-8 lg:gap-12">
        <div
          className="relative hidden lg:block w-full max-w-[737px] shrink-0 rounded-[29px] bg-[#49bbbd] bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${photo})`, minHeight: 700 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-12 left-10 right-10 text-white">
            <p className="text-[32px] xl:text-[37px] font-bold leading-tight">{heading}</p>
            <p className="mt-2 text-[18px] xl:text-[22px] font-light">{subheading}</p>
          </div>
        </div>

        <div className="flex w-full max-w-[454px] mx-auto flex-col justify-center">
          <p className="text-center text-[16px] text-black mb-5">{tagline}</p>

          <AuthTabs active={active} />

          <p className="mt-8 text-[15px] leading-relaxed text-[#5b5b5b]">{description}</p>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
