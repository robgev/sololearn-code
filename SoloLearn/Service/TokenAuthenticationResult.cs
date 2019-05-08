using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoloLearn.Service
{
  public class TokenAuthenticationResult
  {
	public string AccessToken { get; set; }
	public string RefreshToken { get; set; }
	public int ExpiresIn { get; set; }

	public UserBase User { get; set; }
  }
}
