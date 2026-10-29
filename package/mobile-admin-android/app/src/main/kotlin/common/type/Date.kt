package common.type

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlin.time.Instant

/** Decodes the dates of the API (ISO 8601, with or without fractional seconds), like `DateJson` */
object DateSerializer : KSerializer<Instant> {
  override val descriptor = PrimitiveSerialDescriptor("common.type.Date", PrimitiveKind.STRING)

  override fun deserialize(decoder: Decoder): Instant = Instant.parse(decoder.decodeString())

  override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeString(value.toString())
}
