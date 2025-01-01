import User from "./User";
import Entity from "./Entity";
import DeviceEnergy from "./DeviceEnergy";
import Device from "./Device";
import Room from "./Room";
import EntityType from "./EntityType";

// Defning Relations

User.hasMany(Entity, {
  foreignKey: "user_id",
});

Entity.hasMany(Room, {
  foreignKey: "room_id",
});

Entity.hasOne(EntityType, {
  foreignKey: "type_id",
});

Entity.belongsTo(User, {
  foreignKey: "user_id",
});

EntityType.hasMany(Entity, {
  foreignKey: "type_id",
  as: "types",
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
