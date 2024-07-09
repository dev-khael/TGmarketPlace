"use client";
import React, { useState } from "react";
import Image from "next/image";
import { sampleImage } from "@/images";

export default function OrdersPage() {
    return (
        <div className="flex h-auto align-middle justify-center mt-10">
          <div className="card bg-base-100 w-full max-w-[70%] shrink-0 items-center">
            <form className="card-body">
              <div className="overflow-x-auto card h-auto border-2 border-red-400 rounded-box w-[1000px]">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th> Product Name</th>
                      <th> Price</th>
                      <th> Quantity</th>
                      <th> Total Price:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>1</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>2</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>4</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                    <tr>
                      <th>5</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                    <tr>
                      <th>6</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-20 w-20">
                              <Image
                                width={800}
                                height={800}
                                src={sampleImage}
                                alt="product"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Softdrinks</div>
                          </div>
                        </div>
                      </td>
                      <td>30.00</td>
                      <td>3</td>
                      <td>90.00</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th></th>
                      <td></td>
                      <td><b>Grand Total:</b></td>
                      <td>PHP</td>
                      <td>300.00</td>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </form>
          </div>
        </div>
      );
}
