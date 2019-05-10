using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoloLearn.Service
{
  [Flags]
  public enum AccessLevel
  {
	None = 0,
	Basic = 0x1,
	//CreateContent = 0x2,
	//ManageContent = 0x4,
	//MonitorClients = 0x8,
	MonitorUsers = 0x10,
	ManageClients = 0x20,
	ManageUsers = 0x40,
	PushServices = 0x80,
	Admin = 0xFFF0,

	Moderator = 0x2,
	GoldModerator = 0x4,
	PlatinumModerator = 0x8,
  }
}
