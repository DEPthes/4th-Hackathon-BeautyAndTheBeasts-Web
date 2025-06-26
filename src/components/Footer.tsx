export const Footer = () => {
  return (
    <>
      <div className="bg-black flex items-center h-40 w-4/5 m-auto">
        <div className="relative border-white">
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white"></div>
        </div>
        <div className="relative flex flex-col items-center ml-auto pr-4 pt-6 h-20 border-white">
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white"></div>
        </div>
      </div>
    </>
  )
}