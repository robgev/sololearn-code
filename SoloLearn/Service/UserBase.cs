using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoloLearn.Service
{
  public class UserBase
  {
	public int Id { get; set; }
	public string Email { get; set; }
	public string Name { get; set; }
	public bool HasAvatar { get; set; }
	public string AvatarUrl { get; set; }
	public AccessLevel AccessLevel { get; set; }
	public string Badge { get; set; }
	public int Level { get; set; }
	public int Xp { get; set; }

	public bool IsPro { get; set; }
  }
}
