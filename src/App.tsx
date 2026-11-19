import Navbar from './components/Navbar'
import Journey from './components/Journey'
import HazardTape from './components/HazardTape'
import Manifesto from './components/Manifesto'
import Work from './components/Work'
import Process from './components/Process'
import Labs from './components/Labs'
import Pitch from './components/Pitch'
import Openings from './components/Openings'
import Shop from './components/Shop'
import Footer from './components/Footer'
import Sparks from './components/Sparks'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-rust focus:px-4 focus:py-2 focus:text-plum-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="relative outline-none">
        {/* The hero over the fixed footage */}
        <Journey />
        {/* Solid sections slide over the footage */}
        <div className="relative" style={{ zIndex: 1 }}>
          <HazardTape />
          <Manifesto />
          <Work />
          <Process />
          <Labs />
        </div>
        {/* The footage shows through again behind the pitch console */}
        <Pitch />
        <div className="relative" style={{ zIndex: 1 }}>
          <Openings />
          <Shop />
        </div>
      </main>
      <Footer />
      <Sparks />
    </>
  )
}
