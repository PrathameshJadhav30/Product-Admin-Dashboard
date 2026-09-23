export default function ProductFilters({ categories, selectedCategory, onCategoryChange, sortValue, onSortChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={String(category)} value={String(category)}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sort-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Sort
        </label>
        <select
          id="sort-filter"
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>
    </div>
  );
}
