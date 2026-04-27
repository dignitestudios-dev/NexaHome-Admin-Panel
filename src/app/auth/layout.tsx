export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-1 ">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full overflow-hidden  rounded-2xl  shadow-2xl h-screen">
        {/* LEFT PANEL */}
        <div className="hidden md:flex  bg-[#005864] relative flex-col items-center justify-center  text-center">
          {/* Glow circles */}
          <div className="absolute w-[900px] h-[650px] bg-[radial-gradient(ellipse,rgba(215,223,35,0.18)_0%,transparent_50%)] bottom-[-180px]" />
          {/* <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(215,223,35,0.12)_0%,transparent_70%)] top-[-80px] right-[-60px]" /> */}

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <img
                src="/asset/authLogo.png"
                alt="BrandMark"
                className="w-[300px] rounded-lg"
              />
            </div>

            {/* Dots */}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
