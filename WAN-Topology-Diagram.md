# WAN Topology Diagram

This document presents a comprehensive network topology diagram for WAN simulation using Mermaid.

## Network Topology Overview

The following diagram illustrates a WAN setup with 5 LANs connected through routers with static routing configuration.

```mermaid
graph TD;
    A[LAN1] -->|Router 1| B[Router 2];
    A -->|Router 1| C[Router 3];
    B -->|Router 4| D[LAN2];
    C -->|Router 5| E[LAN3];
    C -->|Router 6| F[LAN4];
    B -->|Router 7| G[LAN5];
```

## Static Routing Configuration

The following are the static routing configurations for each router:

- **Router 1**: Routes to LAN2, LAN3, LAN4, and LAN5
- **Router 2**: Routes to LAN1, LAN3, LAN4, and LAN5
- **Router 3**: Routes to LAN1, LAN2, LAN4, and LAN5
- **Router 4**: Routes to LAN1, LAN2, LAN3, and LAN5
- **Router 5**: Routes to LAN1, LAN2, LAN3, and LAN4
- **Router 6**: Routes to LAN1, LAN2, LAN3, and LAN5
- **Router 7**: Routes to LAN1, LAN2, LAN3, and LAN4
