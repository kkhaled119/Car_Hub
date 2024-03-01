"use client";
import { useEffect, useState } from "react";
import { CarCard, Hero, ShowMore } from "@/components";
import CustomeFilter from "@/components/CustomeFilter";
import SearchBar from "@/components/SearchBar";
import { fuels, yearsOfProduction } from "@/constant";
import { fetchCars } from "@/utils";
import Image from "next/image";

export default function Home({}) {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // searchState
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter state
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);

  // pagination states
  const [limit, setLimit] = useState(10);

  const getCars = () => {
    fetchCars({
      manufacturer: manufacturer || "",
      year: year || 202,
      fuel: fuel || "",
      limit: limit || 10,
      model: model || "",
    })
      .then((result) => {
        setAllCars(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCars();
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [fuel, limit, manufacturer, year, model]);
  

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className="home__filter-container">
            <CustomeFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomeFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}
            <ShowMore
              pageNumber={limit || 10 / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
