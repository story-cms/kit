<template>
  <div class="flex items-center justify-between py-4">
    <div class="flex items-center gap-x-4">
      <span class="inline-flex rounded-md shadow-sm isolate">
        <button
          type="button"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium leading-4 text-indigo-700 bg-white border-r rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 hover:ring-indigo-700 hover:border-r hover:border-indigo-700"
        >
          To do
          <span
            class="inline-flex items-center px-2 py-1 ml-1 text-xs font-medium leading-4 text-indigo-700 bg-gray-100 rounded-full"
            >100</span
          >
        </button>

        <button
          type="button"
          class="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-medium leading-4 text-gray-900 bg-white rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          All
          <span
            class="inline-flex items-center px-2 py-1 ml-1 text-xs font-medium leading-4 text-gray-700 bg-gray-100 rounded-full"
            >100</span
          >
        </button>
      </span>
      <button
        type="button"
        class="inline-flex items-center gap-x-2 rounded-full bg-white hover:bg- px-3.5 py-2.5 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-indigo-700"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.43451 0.43451C0.746929 0.12209 1.25346 0.12209 1.56588 0.43451L5.0002 3.86882L8.43451 0.43451C8.74693 0.12209 9.25346 0.12209 9.56588 0.43451C9.8783 0.746929 9.8783 1.25346 9.56588 1.56588L6.13157 5.0002L9.56588 8.43451C9.8783 8.74693 9.8783 9.25346 9.56588 9.56588C9.25346 9.8783 8.74693 9.8783 8.43451 9.56588L5.0002 6.13157L1.56588 9.56588C1.25346 9.8783 0.746929 9.8783 0.43451 9.56588C0.12209 9.25346 0.12209 8.74693 0.43451 8.43451L3.86882 5.0002L0.43451 1.56588C0.12209 1.25346 0.12209 0.746929 0.43451 0.43451Z"
            fill="#4338CA"
          />
        </svg>
        Last Edited
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-x-2 rounded-full bg-white hover:bg- px-3.5 py-2.5 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-indigo-700"
      >
        <svg
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.4001 0.400391C0.95827 0.400391 0.600098 0.758563 0.600098 1.20039C0.600098 1.64222 0.95827 2.00039 1.4001 2.00039H10.2001C10.6419 2.00039 11.0001 1.64222 11.0001 1.20039C11.0001 0.758563 10.6419 0.400391 10.2001 0.400391H1.4001Z"
            fill="#374151"
          />
          <path
            d="M1.4001 3.60039C0.95827 3.60039 0.600098 3.95856 0.600098 4.40039C0.600098 4.84222 0.95827 5.20039 1.4001 5.20039H7.0001C7.44192 5.20039 7.8001 4.84222 7.8001 4.40039C7.8001 3.95856 7.44192 3.60039 7.0001 3.60039H1.4001Z"
            fill="#374151"
          />
          <path
            d="M1.4001 6.80039C0.95827 6.80039 0.600098 7.15856 0.600098 7.60039C0.600098 8.04222 0.95827 8.40039 1.4001 8.40039H4.6001C5.04192 8.40039 5.4001 8.04222 5.4001 7.60039C5.4001 7.15856 5.04192 6.80039 4.6001 6.80039H1.4001Z"
            fill="#374151"
          />
          <path
            d="M11.0001 4.40039C11.0001 3.95856 10.6419 3.60039 10.2001 3.60039C9.75827 3.60039 9.4001 3.95856 9.4001 4.40039L9.4001 8.86902L8.36578 7.83471C8.05336 7.52229 7.54683 7.52229 7.23441 7.83471C6.92199 8.14712 6.92199 8.65366 7.23441 8.96608L9.63441 11.3661C9.78444 11.5161 9.98792 11.6004 10.2001 11.6004C10.4123 11.6004 10.6158 11.5161 10.7658 11.3661L13.1658 8.96608C13.4782 8.65366 13.4782 8.14713 13.1658 7.83471C12.8534 7.52229 12.3468 7.52229 12.0344 7.83471L11.0001 8.86902L11.0001 4.40039Z"
            fill="#374151"
          />
        </svg>

        Status
      </button>
    </div>
    <div>
      <div class="grid grid-cols-1 mt-2">
        <input
          type="text"
          name="search"
          id="search"
          class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
          placeholder="Search"
        />
        <svg
          class="self-center col-start-1 row-start-1 ml-4 text-gray-400 pointer-events-none size-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 7.29583 11.5892 8.49572 10.8907 9.47653L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.47653 10.8907C8.49572 11.5892 7.29583 12 6 12C2.68629 12 0 9.31371 0 6Z"
            fill="#374151"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
