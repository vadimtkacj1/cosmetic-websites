'use client';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const Logo = () => (
  <div className="flex flex-row gap-[10px] items-center">
    <img
      src={`${BASE}/logo.png`}
      alt="Beauty Irena logo"
      width={52}
      height={50}
      className="w-[40px] h-[38px] sm:w-[46px] sm:h-[44px] md:w-[52px] md:h-[50px]"
    />
    <span
      className="text-[18px] sm:text-[20px] font-semibold text-text-primary"
      style={{ fontFamily: 'Playfair Display' }}
    >
      Beauty Irena
    </span>
  </div>
)

export default Logo;
