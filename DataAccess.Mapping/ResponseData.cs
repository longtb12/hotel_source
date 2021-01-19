namespace DataAccess.Mapping
{
    /// <summary></summary>
    /// <typeparam name="T"></typeparam>
    public class ResponseData<T>
    {
        /// <summary>Gets or sets a value indicating whether this <see cref="ResponseData{T}"/> is success.</summary>
        /// <value>
        ///   <c>true</c> if success; otherwise, <c>false</c>.</value>
        public bool Success { get; set; }
        /// <summary>Gets or sets the message.</summary>
        /// <value>The message.</value>
        public string Message { get; set; }
        /// <summary>Gets or sets the data.</summary>
        /// <value>The data.</value>
        public T Data { get; set; }
    }
}
