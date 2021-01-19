using System;

namespace Libraries.Extensions
{
    public class Response<T>
    {
        /// <summary>Gets or sets the time stamp.</summary>
        /// <value>The time stamp.</value>
        public DateTime TimeStamp { get; set; }
        /// <summary>Gets or sets the hash.</summary>
        /// <value>The hash.</value>
        public string Hash { get; set; }
        /// <summary>Gets or sets a value indicating whether this <see cref="T:System.Libraries.Extensions.Response"/> is success.</summary>
        /// <value>
        ///   <c>true</c> if success; otherwise, <c>false</c>.</value>
        public bool Success { get; set; }
        /// <summary>Gets or sets the messages.</summary>
        /// <value>The messages.</value>
        public string Message { get; set; }
        /// <summary>Gets or sets the data.</summary>
        /// <value>The data.</value>
        public T Data { get; set; }
        /// <summary>Gets or sets the nonce.</summary>
        /// <value>The nonce.</value>
        public int Nonce { get; set; } = 0;
    }

}
