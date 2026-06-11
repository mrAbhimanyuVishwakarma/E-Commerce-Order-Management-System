package com.ecommerce.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InventoryReservationRepository extends JpaRepository<InventoryReservation, Long> {
    Optional<InventoryReservation> findByOrderId(Long orderId);
}
