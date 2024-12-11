// components/Ticket.tsx
import React from 'react';

interface TicketProps {
  cart: { product: { name: string; price: number }; quantity: number; discount: number; price: number }[];
  total: number;
}

const Ticket: React.FC<TicketProps> = ({ cart, total }) => {
  return (
    <div className="ticket p-4">
      <h2 className="text-center text-2xl font-bold mb-4">Ticket de Venta</h2>
      <div>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{item.product.name}</span>
            <span>{item.quantity} x ${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 border-t pt-2">
        <span className="font-bold">Total</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Ticket;
