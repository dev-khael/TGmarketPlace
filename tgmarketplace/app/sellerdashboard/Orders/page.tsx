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
  user: {
    name: string;
  };
  vendor_id: number;
  quantity: number;
  total: number;
  delivery_status: string;
  payment_status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [localId, setLocalId] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

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

  const handleCheckboxChange = (itemId: number) => {
    setSelectedCheckbox((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });

    setSelectedItems((prevSelectedItems) => {
      const selected = orders.find((item) => item.id === itemId);
      if (selected) {
        if (prevSelectedItems.some((item) => item.id === itemId)) {
          return prevSelectedItems.filter((item) => item.id !== itemId);
        } else {
          return [...prevSelectedItems, selected];
        }
      }
      return prevSelectedItems;
    });
  };

  const handleSelectAll = () => {
    const allItemIds = orders
      .filter(
        (order) =>
          !(
            order.delivery_status === "Delivered" &&
            order.payment_status === "Paid"
          )
      )
      .map((item) => item.id);
    setSelectedCheckbox(allItemIds);
    setSelectedItems(
      orders.filter(
        (order) =>
          !(
            order.delivery_status === "Delivered" &&
            order.payment_status === "Paid"
          )
      )
    );
  };

  const handleDeselectAll = () => {
    setSelectedCheckbox([]);
    setSelectedItems([]);
  };
  const handleDeliveryStatusChange = async (selectedItems: OrderItem[]) => {
    try {
      if (selectedItems.length === 0) {
        window.alert(
          "Please select an item first before updating delivery status"
        );
        return;
      }
      const response = await api.put(
        `/vendor/update-delivered-orders/${localId}`,
        {
          orderItems: selectedItems,
        }
      );
      response.status === 200
        ? window.alert("Delivered Successfully")
        : console.log("Error updating payment status");
      window.location.reload();
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  const handlePaymentStatusChange = async (selectedItems: OrderItem[]) => {
    try {
      if (selectedItems.length === 0) {
        window.alert(
          "Please select an item first before updating payment status"
        );
        return;
      }
      const response = await api.put(`/vendor/update-paid-orders/${localId}`, {
        orderItems: selectedItems,
      });
      response.status === 200
        ? window.alert("Payment Status Updated")
        : console.log("Error updating payment status");
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <div className="flex w-full flex-col lg:flex-row mt-10 justify-center">
        <div className="card h-auto w-[70%]">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="*:text-center">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={
                        selectedCheckbox.length === orders.length
                          ? handleDeselectAll
                          : handleSelectAll
                      }
                      checked={
                        selectedCheckbox.length === orders.length &&
                        orders.length > 0
                      }
                      className="checkbox"
                    />
                  </th>
                  <th>Order/Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Delivery Status</th>
                  <th>Payment Status</th>
                  <th>Buyer</th>
                </tr>
              </thead>
              {orders.map((order) => (
                <tbody key={order.id}>
                  {order.OrderItem.map((item, itemIndex) => (
                    <tr key={itemIndex} className="*:text-center">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCheckbox.includes(order.id)}
                          onChange={() => handleCheckboxChange(order.id)}
                          className="checkbox"
                          disabled={
                            order.delivery_status === "Delivered" &&
                            order.payment_status === "Paid"
                          }
                        />
                      </td>
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
                        <span className="text-red-500 ml-4">
                          {order.delivery_status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="text-red-500 ml-4">
                          {order.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="ml-4">{order.user.name}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
              <tfoot className="border-t-2 border-black *:text-center">
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
                      className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                      onClick={() => handleDeliveryStatusChange(selectedItems)}
                    >
                      Delivered
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg ml-[-15px]"
                      onClick={() => handlePaymentStatusChange(selectedItems)}
                    >
                      Update Payments
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
