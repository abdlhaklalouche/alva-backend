import User from "./User";
import Entity from "./Entity";
import DeviceEnergy from "./DeviceEnergy";
import Device from "./Device";
import Room from "./Room";
import EntityType from "./EntityType";

// Defning Relations

User.hasMany(Entity, {
  foreignKey: "user_id",
  as: "entities",
});

Entity.hasMany(Room, {
  foreignKey: "entity_id",
  as: "rooms",
  onDelete: "cascade",
});

Entity.hasOne(EntityType, {
  foreignKey: "id",
  sourceKey: "type_id",
  as: "type",
});

Entity.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Room.hasMany(Device, {
  foreignKey: "room_id",
  as: "devices",
});

Room.belongsTo(Entity, {
  foreignKey: "entity_id",
  as: "entity",
});

Device.hasMany(DeviceEnergy, {
  foreignKey: "device_id",
  as: "energies",
});

Device.belongsTo(Room, {
  foreignKey: "room_id",
  as: "room",
});

DeviceEnergy.belongsTo(Device, {
  foreignKey: "device_id",
  as: "device",
});

export { User, EntityType, Entity, Room, Device, DeviceEnergy };
