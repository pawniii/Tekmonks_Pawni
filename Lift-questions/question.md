# Lift Electricity Unit Calculator

This project contains two programs to calculate the electricity units consumed by a lift (elevator) based on its movements. The calculation is based on a collection of requests, where each request has a pickup floor and a drop-off floor.

* **Initial State:** The lift always starts at **Floor 0**

---

## ⚡ Electricity Unit Rules

The total electricity cost is calculated based on the following rules:

1.  **Floor Travel:** **1 unit** per floor traveled.
2.  **Lift Start:** **0.5 units** are consumed *every time* the lift starts moving to travel.
3.  **Changing Direction:** **0.5 units** if the direction changes ( this rule is effectively covered by the "Lift Start" rule, as changing direction requires the lift to stop and start again. It is not an additional cost).


## 📋 Program 1: FIFO Format Calculator

This program simulates the lift serving all requests strictly in First-In-First-Out (FIFO) order as they are given.

## 💡 Program 2: Electricity Efficient Way

This program finds the most electricity-efficient path to service all pickup and drop-off requests, minimizing the total units consumed.
