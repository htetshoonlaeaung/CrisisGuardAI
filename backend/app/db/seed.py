# backend/app/db/seed.py
# Reference emergency shelter seeder for PostgreSQL / Neon database.

import asyncio
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine
from app.db.models.shelter import EmergencyShelter
from app.services.shelter_service import DEFAULT_SHELTERS

logger = logging.getLogger("crisisguard.db.seed")

async def seed_emergency_shelters(db: AsyncSession) -> int:
    """
    Seeds initial reference emergency shelters into the database if empty.
    Returns the number of shelters inserted.
    """
    stmt = select(EmergencyShelter).limit(1)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing is not None:
        logger.info("Emergency shelters table already populated. Skipping seed.")
        return 0

    inserted_count = 0
    for shelter_dict in DEFAULT_SHELTERS:
        shelter = EmergencyShelter(
            name=shelter_dict["name"],
            disaster_type=shelter_dict["disaster_type"],
            address=shelter_dict.get("address", "Downtown Relief Center"),
            latitude=shelter_dict["latitude"],
            longitude=shelter_dict["longitude"],
            capacity=shelter_dict["capacity"],
            current_occupancy=shelter_dict["current_occupancy"],
            contact_phone=shelter_dict["contact_phone"],
            is_open=shelter_dict["is_open"],
            facilities=shelter_dict.get("facilities", ["Medical Bay", "Clean Water", "Backup Generator"])
        )
        db.add(shelter)
        inserted_count += 1

    await db.commit()
    logger.info(f"Successfully seeded {inserted_count} emergency shelters into PostgreSQL.")
    return inserted_count

async def main():
    async with AsyncSessionLocal() as session:
        count = await seed_emergency_shelters(session)
        print(f"[SUCCESS] Seeding complete: {count} reference shelters added.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
