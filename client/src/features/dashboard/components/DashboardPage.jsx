import { useState } from 'react'
import { useListings } from '../hooks/useListings'
import { useRentals }  from '../hooks/useRentals'
import ListingCard from './ListingCard'
import RentalCard  from './RentalCard'

const TEMP_USER_ID = 1

export default function DashboardPage() {
  const [tab, setTab] = useState('listings')

  const {
    listings, loading: lLoad,
    create: createListing, remove: removeListing
  } = useListings(TEMP_USER_ID)

  const {
    rentals, loading: rLoad,
    create: createRental, remove: removeRental
  } = useRentals(TEMP_USER_ID)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
              R
            </div>
            <span className="text-xl font-black tracking-tight text-blue-600">
              Rentopia.
            </span>
          </div>
          <span className="text-sm font-medium text-slate-500">
            Dashboard
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-screen-xl px-6 py-10">

        {/* TABS */}
        <div className="mb-8 flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setTab('listings')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === 'listings'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Barang Saya
          </button>
          <button
            onClick={() => setTab('rentals')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === 'rentals'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Sedang Saya Sewa
          </button>
        </div>

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Daftar Barang
              </h2>
            </div>

            {lLoad ? (
              <p className="text-center text-sm text-slate-400 py-16">
                Memuat...
              </p>
            ) : listings.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-16">
                Belum ada barang. Tambahkan yang pertama!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {listings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onDelete={() => removeListing(listing.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* RENTALS TAB */}
        {tab === 'rentals' && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Sedang Disewa
              </h2>
            </div>

            {rLoad ? (
              <p className="text-center text-sm text-slate-400 py-16">
                Memuat...
              </p>
            ) : rentals.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-16">
                Belum ada rental aktif.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {rentals.map(rental => (
                  <RentalCard
                    key={rental.id}
                    rental={rental}
                    onDelete={() => removeRental(rental.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  )
}