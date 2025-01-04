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
});

Room.belongsTo(Entity, {
  foreignKey: "entity_id",
});

Device.hasMany(DeviceEnergy, {
  foreignKey: "device_id",
});

Device.belongsTo(Room, {
  foreignKey: "room_id",
});

DeviceEnergy.belongsTo(Device, {
  foreignKey: "device_id",
});

export { User, EntityType, Entity, Room, Device, DeviceEnergy };
