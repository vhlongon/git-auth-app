import React from 'react';

type ListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

type ListItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

interface Props<T> extends ListProps {
  items: T[];
  idProp: keyof T;
  renderItem: (item: T) => React.ReactElement;
  itemProps?: (item: T) => ListItemProps;
}

function List<T>({ items, renderItem, itemProps, idProp, ...props }: Props<T>) {
  return (
    <div className="w-full rounded-lg shadow-md md:w-1/3 mx-auto mt-6">
      <ul className="divide-y-2 divide-amber-200" {...props}>
        {items.map((item, index) => (
          <li
            key={`${item[idProp]}`}
            className="flex justify-between p-2 hover:bg-amber-200 hover:text-gray-800"
            {...itemProps?.(item)}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
