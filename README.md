# Aquahero   
Offline Community Health Data Pipeline (Prototype)
Aquahero is an offline-first, community-driven health monitoring prototype designed
to capture, process, and analyze water-borne disease signals in low-infrastructure
environments.
This project focuses on **data ingestion, processing, and rule-based aggregation**
rather than UI complexity.

---

## Problem Statement
Water-borne diseases in rural and semi-urban areas often go undetected until outbreaks
spread widely. Centralized reporting systems introduce delays and miss early signals.
Aquahero explores a decentralized, offline-first approach where communities act as
data producers.

---

## Data Engineering Focus
This prototype demonstrates **core data engineering concepts** using a lightweight
local setup:

- Event-based data ingestion
- Offline data buffering (local storage)
- Staging vs processed data layers
- Deduplication logic
- Batch aggregation by location
- Rule-based anomaly detection
- Exportable analytical datasets (CSV)

---

## Data Flow Architecture

User Event  
->Raw Event Store (`raw_events`)  
->Cleaning & Deduplication  
->Aggregated Metrics  
->Alerts & Exportable Outputs  

This simulates real-world ingestion latency and batch processing.

---

## Data Model (Prototype)

```json
{
  "event_id": "number",
  "source": "citizen | student | health_worker",
  "village": "string",
  "symptom": "enum",
  "severity": "enum",
  "water_quality": "enum",
  "event_time": "ISO-8601",
  "ingested_at": "ISO-8601"
}
