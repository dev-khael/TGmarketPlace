"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api/api";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  productimage: { image_url: string };
  OrderItem: {
    product_name: string;
    quantity: number;
    product_price: number;
  }[];
  vendor_id: number;
  quantity: number;
  total: number;
  delivery_status: string;
  payment_status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [localId, setLocalId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("id");
      setLocalId(userId ? userId : "");
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<OrderItem[]>(
          `/vendor/view-order-as-vendor/${localId}`
        );
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (localId) {
      fetchOrders();
    }
  }, [localId]);

  const handleDeliveryStatusChange = async (orderId: number, status: string) => {
    try {
      await api.put(`/vendor/updateOrders/${orderId}`, {
        delivery_status: status,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, delivery_status: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  const handlePaymentStatusChange = async (orderId: number, status: string) => {
    try {
      await api.put(`/vendor/updateOrders/${orderId}`, {
        payment_status: status,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, payment_status: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <div className="flex w-full flex-col lg:flex-row mt-10 justify-center">
        <div className="card h-auto w-[60%]">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="checkbox" /></th>
                  <th>Order/Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Delivery Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              {orders.map((order,) => (
                <tbody key={order.id}>
                  {order.OrderItem.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td><input type="checkbox" className="checkbox" /></td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className=" h-[150px] w-[150px]">
                              <Image
                                width={800}
                                height={800}
                                src={order.productimage.image_url || ""}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{item.product_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.product_price}</td>
                      <td>{item.quantity}</td>
                      <td>{order.total}</td>
                      <td>{order.delivery_status.toUpperCase()}</td>
                      <td>{order.payment_status.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
              {orders.map((order,) => (
              <tfoot className="border-t-2 border-black">
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>TOTAL :</b>
                  </td>
                  <td>
                    {orders.reduce((acc, order) => acc + +order.total, 0)}
                  </td>
                  <td>
                        <button                           
                          value={order.delivery_status}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleDeliveryStatusChange(order.id, order.delivery_status)}
                          >
                            Delivered
                        </button>
                  </td>
                  <td>
                      <button 
                        
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => handlePaymentStatusChange(order.id, order.payment_status)} 
                        value={order.payment_status}
                        
                        >
                          Update Payments
                      </button></td>
                </tr>
              </tfoot>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
