"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { sampleImage } from "@/images";
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

  return (
    <div>
      <div className="flex w-full flex-col lg:flex-row mt-10 justify-center">
        <div className="card h-auto w-[60%]">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order/Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              {orders.map((order, index) => (
                <tbody>
                  {order.OrderItem.map((item) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
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
                      <td>
                        <select>
                          <option>Delivered</option>
                          <option>Pending</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>TOTAL :</b>
                  </td>
                  <td>
                    {orders &&
                      orders.reduce((acc, order) => acc + +order.total, 0)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
