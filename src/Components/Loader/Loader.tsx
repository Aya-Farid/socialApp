import { ThreeCircles } from 'react-loader-spinner'

export default function Loader() {
  return <div className="flex justify-center w-full items-center h-screen">
              <ThreeCircles
                visible={true}
                height="120"
                width="120"
                color="#1a78f2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
              </div>
}
